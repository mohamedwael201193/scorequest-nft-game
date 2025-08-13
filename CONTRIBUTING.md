# 🤝 Contributing to ScoreQuest NFT

Thank you for your interest in contributing to ScoreQuest NFT! This document provides guidelines for contributing to the project.

## 🎯 Ways to Contribute

- 🐛 **Bug Reports**: Report issues you encounter
- ✨ **Feature Requests**: Suggest new features or improvements
- 🔧 **Code Contributions**: Submit bug fixes or new features
- 📖 **Documentation**: Improve documentation and guides
- 🎨 **Design**: Enhance UI/UX and visual elements
- 🧪 **Testing**: Help test new features and report issues

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- Git
- MetaMask browser extension
- Basic knowledge of React, Web3, and Flask

### Development Setup

1. **Fork the Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/scorequest-nft-game.git
   cd scorequest-nft-game
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Setup Backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1: Frontend
   npm run dev
   
   # Terminal 2: Backend
   cd backend
   python src/main.py
   ```

## 📝 Development Guidelines

### Code Style

**Frontend (React/JavaScript):**
- Use functional components with hooks
- Follow ESLint configuration
- Use TypeScript for type safety (when applicable)
- Prefer const/let over var
- Use meaningful variable names

**Backend (Python/Flask):**
- Follow PEP 8 style guide
- Use type hints where applicable
- Write docstrings for functions
- Keep functions small and focused

### Component Structure

```
src/
├── components/          # Reusable UI components
├── services/           # API and Web3 services
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── assets/             # Static assets
```

### Naming Conventions

- **Components**: PascalCase (`GameArea.jsx`)
- **Files**: camelCase (`gameLogic.js`)
- **Variables**: camelCase (`playerScore`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_SCORE`)

## 🔄 Contribution Workflow

### 1. Create an Issue

Before starting work, create an issue to:
- Describe the bug or feature
- Discuss the approach
- Get feedback from maintainers

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 3. Make Changes

- Write clean, well-documented code
- Follow existing code style
- Add tests for new features
- Update documentation as needed

### 4. Test Your Changes

**Frontend Testing:**
```bash
npm run build
npm run preview
```

**Backend Testing:**
```bash
cd backend
python -m pytest tests/
```

**Manual Testing:**
- Test game functionality
- Verify MetaMask integration
- Check responsive design
- Test on different browsers

### 5. Commit Changes

Use conventional commit messages:
```bash
git commit -m "feat: add combo multiplier system"
git commit -m "fix: resolve MetaMask connection issue"
git commit -m "docs: update deployment guide"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Create a Pull Request with:
- Clear title and description
- Link to related issues
- Screenshots (for UI changes)
- Testing instructions

## 🧪 Testing Guidelines

### Frontend Tests

- Test component rendering
- Test user interactions
- Test Web3 integration
- Test responsive design

### Backend Tests

- Test API endpoints
- Test database operations
- Test error handling
- Test CORS functionality

### Manual Testing Checklist

- [ ] Game starts and ends correctly
- [ ] Targets appear and can be clicked
- [ ] Score updates properly
- [ ] Combo system works
- [ ] MetaMask connects successfully
- [ ] NFT minting functions
- [ ] Leaderboard updates
- [ ] Social sharing works
- [ ] Mobile responsive
- [ ] Cross-browser compatibility

## 🎨 Design Guidelines

### Visual Style

- **Theme**: Cyberpunk/futuristic
- **Colors**: Neon blues, purples, pinks
- **Typography**: Clean, modern fonts
- **Effects**: Glowing, animated elements

### UI/UX Principles

- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Fast loading and smooth animations
- **Mobile-first**: Responsive design
- **Intuitive**: Clear navigation and feedback

## 📋 Issue Templates

### Bug Report

```markdown
**Describe the bug**
A clear description of the bug.

**To Reproduce**
Steps to reproduce the behavior.

**Expected behavior**
What you expected to happen.

**Screenshots**
Add screenshots if applicable.

**Environment:**
- Browser: [e.g. Chrome 91]
- Device: [e.g. iPhone 12]
- MetaMask version: [e.g. 10.8.1]
```

### Feature Request

```markdown
**Feature Description**
Clear description of the feature.

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should this feature work?

**Alternatives**
Alternative solutions considered.
```

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Special NFT rewards (for significant contributions)

## 📞 Getting Help

- **Discord**: Join our community server
- **GitHub Discussions**: Ask questions and share ideas
- **Issues**: Report bugs and request features

## 📄 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Unacceptable behavior includes:**
- Harassment of any kind
- Trolling, insulting, or derogatory comments
- Public or private harassment
- Publishing others' private information

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team. All complaints will be reviewed and investigated promptly and fairly.

## 🙏 Thank You

Thank you for contributing to ScoreQuest NFT! Your contributions help make Web3 gaming more accessible and fun for everyone.

---

**Happy Contributing! 🎮**

