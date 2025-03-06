const express = require('express');
const router = express.Router({ mergeParams: true });
// mergeParams: true => 부모 라우터의 파라미터 사용 가능

const vocaController = require('../controllers/VocaController');
const quizController = require('../controllers/QuizController');


// Root - /api/users/{userId}/set/{setId}/voca

// ---------- Quiz ----------

// 퀴즈 단어 추출
router.get('/quiz', quizController.getQuizVoca);
router.post('/quiz/submit', quizController.submitQuiz); // 채점 API
// Express의 라우트 매칭은 위에서 아래로 진행
// 즉, '/quiz' 요청이 들어오면 먼저 /:vocaId 패턴이 vocaId="quiz"로 인식되면서 getVoca가 실행됩니다.
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




module.exports = router;
