const express = require('express');
const router = express.Router({ mergeParams: true });
// mergeParams: true => 부모 라우터의 파라미터 사용 가능

const setController = require('../controllers/SetController');
const vocaController = require('../controllers/VocaController');
const vocaRouter = require('../routes/VocaRouter');

// ---------- Voca Set ----------
// ✅ 전체 세트 조회 (추가해야 함)
router.get('/', setController.getAllSets);

// 세트 생성
router.post('/', setController.postSet);

// 세트 조회 (세트 정보 + 단어 목록)
router.get('/:setId', setController.getSet);


// 세트의 모든 단어 조회
router.get('/:setId/voca', vocaController.getAllVoca);

// 세트의 단어목록 가져오기
router.get('/:userId/set/:setId/voca', setController.getVocaList);

// 세트 수정
router.put('/:setId', setController.updateSet);

// 세트 삭제
router.delete('/:setId', setController.deleteSet);

// ---------- Voca ----------

// 단어 라우터 연결
router.use('/:setId/voca', vocaRouter);

module.exports = router;
