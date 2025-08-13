from src.models.user import db
from datetime import datetime

class LeaderboardEntry(db.Model):
    __tablename__ = 'leaderboard'
    
    id = db.Column(db.Integer, primary_key=True)
    wallet_address = db.Column(db.String(42), nullable=False, unique=True)  # Ethereum addresses are 42 chars
    score = db.Column(db.Integer, nullable=False, default=0)
    nft_minted = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'wallet_address': self.wallet_address,
            'score': self.score,
            'nft_minted': self.nft_minted,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<LeaderboardEntry {self.wallet_address}: {self.score}>'

