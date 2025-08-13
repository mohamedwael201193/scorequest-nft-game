from flask import Blueprint, request, jsonify
from src.models.leaderboard import db, LeaderboardEntry
from sqlalchemy import desc

leaderboard_bp = Blueprint('leaderboard', __name__)

@leaderboard_bp.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    """Get the top players from the leaderboard"""
    try:
        # Get top 10 players ordered by score (descending)
        top_players = LeaderboardEntry.query.order_by(desc(LeaderboardEntry.score)).limit(10).all()
        
        leaderboard_data = []
        for player in top_players:
            leaderboard_data.append({
                'address': player.wallet_address,
                'score': player.score,
                'nft_minted': player.nft_minted
            })
        
        return jsonify({
            'success': True,
            'leaderboard': leaderboard_data
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@leaderboard_bp.route('/leaderboard/submit', methods=['POST'])
def submit_score():
    """Submit a new score for a player"""
    try:
        data = request.get_json()
        print(f"Received data: {data}")  # Debug logging
        
        if not data:
            print("No data provided")  # Debug logging
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        wallet_address = data.get('wallet_address')
        score = data.get('score')
        
        if not wallet_address or score is None:
            return jsonify({
                'success': False,
                'error': 'wallet_address and score are required'
            }), 400
        
        # Validate wallet address format (basic check)
        if not wallet_address.startswith('0x') or len(wallet_address) != 42:
            return jsonify({
                'success': False,
                'error': 'Invalid wallet address format'
            }), 400
        
        # Validate score
        if not isinstance(score, int) or score < 0:
            return jsonify({
                'success': False,
                'error': 'Score must be a non-negative integer'
            }), 400
        
        # Check if player already exists
        existing_player = LeaderboardEntry.query.filter_by(wallet_address=wallet_address).first()
        
        if existing_player:
            # Update score only if new score is higher
            if score > existing_player.score:
                existing_player.score = score
                db.session.commit()
                
                return jsonify({
                    'success': True,
                    'message': 'Score updated successfully',
                    'new_best': True,
                    'score': score
                }), 200
            else:
                return jsonify({
                    'success': True,
                    'message': 'Score submitted but not a new best',
                    'new_best': False,
                    'current_best': existing_player.score,
                    'submitted_score': score
                }), 200
        else:
            # Create new player entry
            new_player = LeaderboardEntry(
                wallet_address=wallet_address,
                score=score
            )
            db.session.add(new_player)
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': 'New player added to leaderboard',
                'new_best': True,
                'score': score
            }), 201
            
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@leaderboard_bp.route('/leaderboard/nft-minted', methods=['POST'])
def mark_nft_minted():
    """Mark that a player has minted their NFT"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        wallet_address = data.get('wallet_address')
        
        if not wallet_address:
            return jsonify({
                'success': False,
                'error': 'wallet_address is required'
            }), 400
        
        # Find the player
        player = LeaderboardEntry.query.filter_by(wallet_address=wallet_address).first()
        
        if not player:
            return jsonify({
                'success': False,
                'error': 'Player not found in leaderboard'
            }), 404
        
        # Mark NFT as minted
        player.nft_minted = True
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'NFT minting status updated'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@leaderboard_bp.route('/leaderboard/player/<wallet_address>', methods=['GET'])
def get_player_stats(wallet_address):
    """Get stats for a specific player"""
    try:
        player = LeaderboardEntry.query.filter_by(wallet_address=wallet_address).first()
        
        if not player:
            return jsonify({
                'success': False,
                'error': 'Player not found'
            }), 404
        
        # Get player's rank
        players_with_higher_scores = LeaderboardEntry.query.filter(
            LeaderboardEntry.score > player.score
        ).count()
        rank = players_with_higher_scores + 1
        
        return jsonify({
            'success': True,
            'player': {
                'address': player.wallet_address,
                'score': player.score,
                'nft_minted': player.nft_minted,
                'rank': rank,
                'created_at': player.created_at.isoformat(),
                'updated_at': player.updated_at.isoformat()
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

