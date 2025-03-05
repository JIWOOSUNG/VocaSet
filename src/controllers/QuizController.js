const pool = require('../models/DB_Pool');
const { response } = require('../utils/format');

// 퀴즈 단어 추출
exports.getQuizVoca = async (req, res) => {
    const { setId } = req.body;
    // TODO : 문제 갯수를 입력받을지 결정
    const { quantity } = req.body;
    if (!quantity) {
        return res.status(400).json(response('fail', '갯수를 입력하세요'));
    }

    const quizData = [setId, quantity];
    const sql = 'select voca_id, word, meaning from voca where set_id = ? order by RAND() limit ?';

    try {
        const [result] = await pool.query(sql, quizData); // []

        if (result.length > 0) {
            res.json(response('success', `${setId}번 세트의 퀴즈를 생성했습니다`, result));
        } else {
            res.status(404).json(response('fail', `단어가 없습니다`));
        }
    } catch (err) {
        console.error('Error: ' + err);
        res.status(500).json(response('fail', 'DB 연결 실패: ' + err.message));
    }
};

// 퀴즈 채점
exports.postQuizVoca = async () => {
    // TODO : 어떤 형식으로 사용자의 답을 받을지 결정
    const { answer } = req.body;
};
