const { verifyToken } = require('../utils/jwt');
const { response } = require('../utils/format');

exports.authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json(response('fail', '토큰이 없습니다.'));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json(response('fail', '유효하지 않은 토큰입니다.'));
    }

    req.user = decoded; // 요청 객체에 사용자 정보 추가
    next();
};
