const pool = require('../models/DB_Pool');
const { response } = require('../utils/format');
const bcrypt = require('bcryptjs');

// 회원정보 조회
exports.getUser = async (req, res) => {
    const { userId } = req.params;
    const sql = `select * from user where id=?`;

    try {
        const [result] = await pool.query(sql, [userId]); // []

        if (result.length > 0) {
            res.json(response('success', `${userId}번 회원을 조회합니다`, result));
        } else {
            res.status(404).json(response('fail', `${userId}번 회원은 없습니다`));
        }
    } catch (err) {
        console.error('Error: ' + err);
        res.status(500).json(response('fail', 'DB 연결 실패: ' + err.message));
    }
};

// 회원가입
exports.postUser = async (req, res) => {
    const { user_name, user_email, password } = req.body;
    
    if (!user_name || !user_email || !password) {
        return res.status(400).json(response('fail', '내용을 입력하세요'));
    }

    try {
        // 비밀번호 해싱
        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed:', hashedPassword);

        const userData = [user_name, user_email, hashedPassword];
        const sql = `
            INSERT INTO user (user_name, user_email, password)
            VALUES (?, ?, ?)
        `;

        const [result] = await pool.query(sql, userData);
        console.log('DB Insert result:', result);

        if (result.affectedRows > 0) {
            res.json(response('success', '회원가입에 성공했습니다', req.body));
        } else {
            res.status(500).json(response('fail', '회원가입에 실패했습니다'));
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json(response('fail', 'DB 연결 실패: ' + err.message));
    }
};



// 회원정보 수정
exports.updateUser = async (req, res) => {
    const { userId } = req.params;
    const { user_name, user_email, password } = req.body;
    if (!user_name || !user_email || !password) {
        return res.status(400).json(response('fail', '빈 내용은 입력할 수 없습니다'));
    }

    const userData = [user_name, user_email, password];
    const sql = `
    update user
    set user_name = ?, user_email = ?, password = ?
    where id = ?
  `;

    try {
        const [result] = await pool.query(sql, [...userData, userId]);
        if (result.affectedRows > 0) {
            res.json(response('success', `${userId}번 회원정보 수정에 성공했습니다`, req.body));
        } else {
            res.status(500).json(response('fail', `${userId}번 회원정보 수정에 실패했습니다`));
        }
    } catch (err) {
        console.error('Error: ' + err);
        res.status(500).json(response('fail', 'DB 연결 실패: ' + err.message));
    }
};

// 회원탈퇴
exports.deleteUser = async (req, res) => {
    const { userId } = req.params;
    const sql = `delete from user where id=? `;

    try {
        const [result] = await pool.query(sql, [userId]); // {}

        if (result.affectedRows > 0) {
            res.json(response('success', `${userId}번 회원탈퇴에 성공했습니다`));
        } else {
            res.status(500).json(response('fail', `회원탈퇴에 실패했습니다`));
        }
    } catch (err) {
        console.error('Error: ' + err);
        res.status(500).json(response('fail', 'DB 연결 실패: ' + err.message));
    }
};

// 이메일 중복 여부 확인 - email (unique 제약조건) - TBD
// exports.validateEmail = async (req, res) => {
//     const { user_email } = req.body;
//     if (!user_email) {
//         return res.status(400).json(response('fail', '이메일을 입력하세요'));
//     }

//     const sql = `select id from members where email=?`;

//     try {
//         const [result] = await pool.query(sql, [user_email]); // []
//         // const isAvailable = result.length > 0 ? 'no' : 'yes';
//         const msg = result.length > 0 ? '해당 이메일은 현재 사용중입니다' : '해당 이메일은 사용 가능합니다';
//         const data = result.length > 0 ? null : user_email;

//         res.json(response('success', msg, data));
//     } catch (err) {
//         console.error('Error: ' + err);
//         res.status(500).json(response('fail', 'DB 연결 실패: ' + err.message));
//     }
// };
