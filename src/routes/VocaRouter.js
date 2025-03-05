const express = require('express');
const router = express.Router({ mergeParams: true });
// mergeParams: true => 부모 라우터의 파라미터 사용 가능

const vocaController = require('../controllers/VocaController');
const quizController = require('../controllers/QuizController');

// ---------- Voca ----------

// 전체 단어 조회
router.get('/', vocaController.getAllVoca);

// 단어 생성
router.post('/', vocaController.postVoca);

// 단어 조회
router.get('/:vocaId', vocaController.getVoca);

// 단어 수정
router.put('/:vocaId', vocaController.updateVoca);

// 단어 삭제
router.delete('/:vocaId', vocaController.deleteVoca);

// ---------- Quiz ----------

// 퀴즈 단어 추출
router.get('/quiz', quizController.getQuizVoca);

// 퀴즈 채점
router.post('/quiz', quizController.postQuizVoca);

module.exports = router;
