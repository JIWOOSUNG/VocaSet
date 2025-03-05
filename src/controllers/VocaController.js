const pool = require('../models/DB_Pool');
const { response } = require('../utils/format');

// 전체 단어 조회
exports.getAllVoca = async (req, res) => {
    const { setId } = req.params;
    const sql = `select * from voca_set where set_id=?`;

    try {
        const [result] = await pool.query(sql, [setId]); // []

        if (result.length > 0) {
            res.json(response('success', `${setId}번 세트의 단어를 조회합니다`, result));
        } else {
            res.status(404).json(response('fail', `단어가 없습니다`));
        }
    } catch (err) {
        console.error('Error: ' + err);
        res.status(500).json(response('fail', 'DB 연결 실패: ' + err.message));
    }
};

// 단어 조회
exports.getVoca = async (req, res) => {
    const { vocaId } = req.params;
    const sql = `select * from voca_set where voca_id=?`;

    try {
        const [result] = await pool.query(sql, [setId]); // []

        if (result.length > 0) {
            res.json(response('success', `${vocaId}번 단어를 조회합니다`, result));
        } else {
            res.status(404).json(response('fail', `${vocaId}번 단어는 없습니다`));
        }
    } catch (err) {
        console.error('Error: ' + err);
        res.status(500).json(response('fail', 'DB 연결 실패: ' + err.message));
    }
};

// 단어 생성
exports.postVoca = async (req, res) => {
    const { setId } = req.params;
    const { word, meaning } = req.body;
    if (!word || !meaning) {
        return res.status(400).json(response('fail', '내용을 입력하세요'));
    }

    const vocaData = [setId, word, meaning];
    const sql = `
      insert into voca_set(set_id, word, meaning)
      value(?, ?, ?)
    `;

    try {
        const [result] = await pool.query(sql, vocaData);

        if (result.affectedRows > 0) {
            res.json(response('success', '단어 생성에 성공했습니다', req.body));
        } else {
            res.status(500).json(response('fail', `단어 생성에 실패했습니다`));
        }
    } catch (err) {
        console.error('Error: ' + err);
        res.status(500).json(response('fail', 'DB 연결 실패: ' + err.message));
    }
};

// 단어 수정
exports.updateVoca = async (req, res) => {
    const { vocaId } = req.params;
    const { word, meaning } = req.body;
    if (!word || !meaning) {
        return res.status(400).json(response('fail', '빈 내용은 입력할 수 없습니다'));
    }

    const setData = [vocaId, set_name, description];
    const sql = `
    update voca_set
    set word = ?, meaning = ? 
    where voca_id = ?
  `;

    try {
        const [result] = await pool.query(sql, [...setData, setId]);
        if (result.affectedRows > 0) {
            res.json(response('success', `${vocaId}번 단어 수정에 성공했습니다`, req.body));
        } else {
            res.status(500).json(response('fail', `${vocaId}번 단어 수정에 실패했습니다`));
        }
    } catch (err) {
        console.error('Error: ' + err);
        res.status(500).json(response('fail', 'DB 연결 실패: ' + err.message));
    }
};

// 단어 삭제
exports.deleteVoca = async (req, res) => {
    const { setId } = req.params;
    const sql = `delete from voca_set where voca_id=? `;

    try {
        const [result] = await pool.query(sql, [setId]); // {}

        if (result.affectedRows > 0) {
            res.json(response('success', `${setId}번 단어 삭제에 성공했습니다`));
        } else {
            res.status(500).json(response('fail', `단어 삭제에 실패했습니다`));
        }
    } catch (err) {
        console.error('Error: ' + err);
        res.status(500).json(response('fail', 'DB 연결 실패: ' + err.message));
    }
};
