const pool = require('../models/DB_Pool');
const { response } = require('../utils/format');

// 퀴즈 단어 추출 (최대 10개, 부족하면 있는 만큼)
exports.getQuizVoca = async (req, res) => {

    console.log('🔥 getQuizVoca 실행됨!'); // ✅ 함수 실행 확인
    console.log('Request Params:', req.params); // 👀 전체 파라미터 확인
    const { setId } = req.params;
    console.log('Extracted setId:', setId); // ✅ setId 값 확인

    if (!setId) {
        return res.status(400).json(response('fail', 'setId가 필요합니다.'));
    }

    try {
        // 📌 쿼리 실행 전에 setId가 숫자로 변환되었는지 확인
        const numericSetId = Number(setId);
        console.log('Numeric setId:', numericSetId); // ✅ 변환된 숫자 출력

        // 📌 단어 개수 확인
        const countSql = 'SELECT COUNT(*) as total FROM voca WHERE set_id = ?';
        const [countResult] = await pool.query(countSql, [numericSetId]);
        console.log('Word count result:', countResult); // ✅ 결과 확인

        const totalWords = countResult[0].total;
        console.log('Total words in set:', totalWords);

        if (totalWords === 0) {
            return res.status(404).json(response('fail', '퀴즈용 단어가 없습니다.', null));
        }

        // 📌 퀴즈용 단어 가져오기
        const quizSize = Math.min(10, totalWords);
        const sql = 'SELECT voca_id, word, meaning FROM voca WHERE set_id = ? ORDER BY RAND() LIMIT ?';
        const [result] = await pool.query(sql, [numericSetId, quizSize]);

        console.log('DB Query Result:', result); // ✅ 최종 결과 확인

        res.json(response('success', '퀴즈 단어를 가져왔습니다.', result));
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json(response('fail', 'DB 연결 실패: ' + err.message));
    }
};


// 사용자가 퀴즈를 풀고 답안 제출
exports.submitQuiz = async (req, res) => {
    const { setId } = req.params;
    const { answers } = req.body; // 사용자가 입력한 답안들 [{ voca_id, user_answer }, ...]

    if (!setId) {
        return res.status(400).json(response('fail', 'setId가 필요합니다.'));
    }

    if (!answers || !Array.isArray(answers)) {
        return res.status(400).json(response('fail', '유효한 답안 배열을 제공해야 합니다.'));
    }

    try {
        // 📌 1️⃣ 정답 가져오기
        const vocaIds = answers.map(ans => ans.voca_id);
        const sql = `SELECT voca_id, meaning FROM voca WHERE set_id = ? AND voca_id IN (?)`;
        const [correctAnswers] = await pool.query(sql, [setId, vocaIds]);

        let score = 0;
        let results = [];

        // 📌 2️⃣ 채점
        answers.forEach(userAnswer => {
            const correct = correctAnswers.find(ca => ca.voca_id === userAnswer.voca_id);
            if (correct) {
                const isCorrect = correct.meaning.trim().toLowerCase() === userAnswer.user_answer.trim().toLowerCase();
                if (isCorrect) score += 1;
                results.push({
                    voca_id: userAnswer.voca_id,
                    user_answer: userAnswer.user_answer,
                    correct_answer: correct.meaning,
                    is_correct: isCorrect
                });
            }
        });

        res.json(response('success', '퀴즈 채점 완료', { score, total: answers.length, results }));
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json(response('fail', '퀴즈 채점 실패: ' + err.message));
    }
};
