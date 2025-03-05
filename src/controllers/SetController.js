const pool = require('../models/DB_Pool');
const { response } = require('../utils/format');

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
exports.postSet = async (req, res) => {
    const { userId } = req.params;
    const { set_name, description } = req.body;
    if (!set_name || !description) {
        return res.status(400).json(response('fail', '내용을 입력하세요'));
    }

    const setData = [userId, set_name, description];
    const sql = `
      insert into voca_set(user_id, set_name, description)
      value(?, ?, ?)
    `;

    try {
        const [result] = await pool.query(sql, setData);

        if (result.affectedRows > 0) {
            res.json(response('success', '세트 생성에 성공했습니다', req.body));
        } else {
            res.status(500).json(response('fail', `세트 생성에 실패했습니다`));
        }
    } catch (err) {
        console.error('Error: ' + err);
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
