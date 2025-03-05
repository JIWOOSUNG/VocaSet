const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET;
const EXPIRES_IN = '1h'; // 토큰 만료 시간

// JWT 토큰 생성 함수
exports.generateToken = (user) => {
    return jwt.sign(
        { userId: user.id, email: user.user_email },
        SECRET_KEY,
        { expiresIn: EXPIRES_IN }
    );
};

// JWT 토큰 검증 함수
exports.verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (err) {
        return null;
    }
};
