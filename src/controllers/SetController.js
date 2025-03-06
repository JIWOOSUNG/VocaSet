const pool = require('../models/DB_Pool');
const { response } = require('../utils/format');

//특정사용자 모든 단어세트 조회
exports.getAllSets = async (req, res) => {
    const { userId } = req.params;
    console.log('GET 요청 확인: userId =', userId); // ✅ userId가 정상적으로 전달되는지 확인

    if (!userId) {
        return res.status(400).json(response('fail', 'userId가 필요합니다.'));
    }

    const sql = `SELECT * FROM voca_set WHERE user_id = ?`;

    try {
        const [result] = await pool.query(sql, [userId]);

        if (result.length > 0) {
            res.json(response('success', `${userId}번 사용자의 단어 세트 목록`, result));
        } else {
            res.status(404).json(response('fail', '단어 세트가 없습니다.'));
        }
    } catch (err) {
        console.error('단어 세트 조회 오류:', err);
        res.status(500).json(response('fail', 'DB 연결 실패: ' + err.message));
    }
};

// 세트 조회
exports.getSet = async (req, res) => {
    const { setId } = req.params;
    const sql = `select * from voca_set where set_id=?`;

    try {
        const [result] = await pool.query(sql, [setId]); // []

        if (result.length > 0) {
            res.json(response('success', `${setId}번 세트를 조회합니다`, result));
        } else {
            res.status(404).json(response('fail', `${setId}번 세트는 없습니다`));
        }
    } catch (err) {
        console.error('Error: ' + err);
        res.status(500).json(response('fail', 'DB 연결 실패: ' + err.message));
    }
};

// 세트 생성
// exports.postSet = async (req, res) => {
//     const { userId } = req.params;
//     const { set_name, description } = req.body;
//     if (!set_name || !description) {
//         return res.status(400).json(response('fail', '내용을 입력하세요'));
//     }

//     const setData = [userId, set_name, description];
//     const sql = `
//       insert into voca_set(user_id, set_name, description)
//       value(?, ?, ?)
//     `;

//     try {
//         const [result] = await pool.query(sql, setData);

//         if (result.affectedRows > 0) {
//             res.json(response('success', '세트 생성에 성공했습니다', req.body));
//         } else {
//             res.status(500).json(response('fail', `세트 생성에 실패했습니다`));
//         }
//     } catch (err) {
//         console.error('Error: ' + err);
//         res.status(500).json(response('fail', 'DB 연결 실패: ' + err.message));
//     }
// };

// 단어가져오는 로직
exports.getVocaList = async (req, res) => {
    const { userId, setId } = req.params;
    const sql = `SELECT * FROM voca WHERE set_id=? AND EXISTS (SELECT 1 FROM voca_set WHERE set_id=? AND user_id=?)`;

    try {
        const [result] = await pool.query(sql, [setId, setId, userId]);
        if (result.length > 0) {
            res.json(response('success', `${setId}번 세트의 단어 목록입니다`, result));
        } else {
            res.status(404).json(response('fail', `${setId}번 세트에 단어가 없습니다`));
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json(response('fail', 'DB 연결 실패: ' + err.message));
    }
};

// exports.postSet = async (req, res) => {
//     const { userId } = req.params;
//     const { set_name, description, words } = req.body; // ✅ 단어 목록도 함께 받음

//     if (!set_name || !description || !words || words.length === 0) {
//         return res.status(400).json(response('fail', '세트 정보와 단어를 입력하세요'));
//     }

//     const setData = [userId, set_name, description];
//     const sqlInsertSet = `
//       INSERT INTO voca_set (user_id, set_name, description)
//       VALUES (?, ?, ?)
//     `;

//     try {
//         // 1️⃣ 세트 저장
//         const [setResult] = await pool.query(sqlInsertSet, setData);
//         if (setResult.affectedRows === 0) {
//             return res.status(500).json(response('fail', '세트 생성에 실패했습니다.'));
//         }

//         const setId = setResult.insertId; // ✅ 생성된 세트 ID 가져오기

//         // 2️⃣ 단어 저장 (배열 반복문 실행)
//         const sqlInsertVoca = `
//           INSERT INTO voca (set_id, word, meaning)
//           VALUES ?
//         `;
//         const vocaData = words.map((word) => [setId, word.word, word.meaning]); // ✅ 배열 변환
//         await pool.query(sqlInsertVoca, [vocaData]); // ✅ 단어 여러 개 한 번에 저장

//         // 3️⃣ 응답 반환 (세트 ID 포함)
//         res.json(response('success', '세트 및 단어 저장 성공', { set_id: setId }));
//     } catch (err) {
//         console.error('Error:', err);
//         res.status(500).json(response('fail', 'DB 연결 실패: ' + err.message));
//     }
// };

// ✅ 단어 세트 + 단어 함께 저장하기
exports.postSet = async (req, res) => {
    const { userId } = req.params;
    const { set_name, description, words } = req.body; // 단어 배열도 함께 받음

    if (!set_name || !description) {
        return res.status(400).json(response('fail', '세트 이름과 설명을 입력하세요.'));
    }

    const sqlInsertSet = `
      INSERT INTO voca_set(user_id, set_name, description) 
      VALUES (?, ?, ?)
    `;

    try {
        const [setResult] = await pool.query(sqlInsertSet, [userId, set_name, description]);

        if (setResult.affectedRows > 0) {
            const setId = setResult.insertId; // 생성된 세트 ID

            // ✅ 단어 배열이 존재하면 단어도 함께 저장
            if (words && words.length > 0) {
                const sqlInsertWord = `
                  INSERT INTO voca(set_id, word, meaning) 
                  VALUES ?
                `;
                const wordValues = words.map((word) => [setId, word.word, word.meaning]);
                await pool.query(sqlInsertWord, [wordValues]);
            }

            res.json(response('success', '세트와 단어가 저장되었습니다.', { setId }));
        } else {
            res.status(500).json(response('fail', '세트 저장에 실패했습니다.'));
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json(response('fail', 'DB 연결 실패: ' + err.message));
    }
};

// 세트 수정
exports.updateSet = async (req, res) => {
    const { setId } = req.params;
    const { set_name, description } = req.body;
    if (!set_name || !description) {
        return res.status(400).json(response('fail', '빈 내용은 입력할 수 없습니다'));
    }

    const setData = [setId, set_name, description];
    const sql = `
    update voca_set
    set set_name = ?, description = ? 
    where set_id = ?
  `;

    try {
        const [result] = await pool.query(sql, [...setData, setId]);
        if (result.affectedRows > 0) {
            res.json(response('success', `${setId}번 세트 수정에 성공했습니다`, req.body));
        } else {
            res.status(500).json(response('fail', `${setId}번 세트 수정에 실패했습니다`));
        }
    } catch (err) {
        console.error('Error: ' + err);
        res.status(500).json(response('fail', 'DB 연결 실패: ' + err.message));
    }
};

// 세트 삭제
exports.deleteSet = async (req, res) => {
    const { setId } = req.params;
    const sql = `delete from voca_set where set_id=? `;

    try {
        const [result] = await pool.query(sql, [setId]); // {}

        if (result.affectedRows > 0) {
            res.json(response('success', `${setId}번 세트 삭제에 성공했습니다`));
        } else {
            res.status(500).json(response('fail', `세트 삭제에 실패했습니다`));
        }
    } catch (err) {
        console.error('Error: ' + err);
        res.status(500).json(response('fail', 'DB 연결 실패: ' + err.message));
    }
};
