const pool = require('../models/DB_Pool');
const bcrypt = require('bcryptjs');
const { response } = require('../utils/format');
const { generateToken } = require('../utils/jwt');

// 로그인
exports.login = async (req, res) => {
    const { user_email, password } = req.body;

    if (!user_email || !password) {
        return res.status(400).json(response('fail', '이메일과 비밀번호를 입력하세요.'));
    }

    const sql = `SELECT * FROM user WHERE user_email = ?`;

    try {
        const [users] = await pool.query(sql, [user_email]);

        if (users.length === 0) {
            return res.status(401).json(response('fail', '이메일 또는 비밀번호가 잘못되었습니다.'));
        }

        const user = users[0];

        // 비밀번호 비교
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json(response('fail', '이메일 또는 비밀번호가 잘못되었습니다.'));
        }

        // JWT 토큰 생성
        const token = generateToken(user);
        res.json(response('success', '로그인 성공', { token }));
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json(response('fail', 'DB 연결 실패: ' + err.message));
    }
};
