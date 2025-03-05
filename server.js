const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const pool = require('./src/models/DB_Pool');
require('dotenv').config();

// 환경변수
const port = process.env.PORT;
const host = process.env.HOST;

// 서비스 진입 라우터
const userRouter = require('./src/routes/UserRouter');

const app = express();

// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));


//---------------------------------------
// 라우터 연결
app.use('/api/users', userRouter);
const authRouter = require('./src/routes/AuthRouter');

// 로그인 라우트 추가
app.use('/api/auth', authRouter);
//---------------------------------------




// 루트 경로
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// 서버 시작
app.listen(port, () => {
    console.log('Server Connected: http://' + host + ':' + port);
});

// 서버 종료 시, Pool 종료
process.on('SIGINT', () => {
    // 인터럽트 신호 이벤트 => 사용자가 터미널에서 Ctrl + C 키를 눌러 프로세스를 종료하려고 할 때 발생
    pool.end(() => {
        console.log('Database pool closed');
        process.exit(0);
    });
});
process.on('SIGTERM', () => {
    // 종료 신호 이벤트 => 영 체제 또는 다른 프로세스가 프로세스를 종료하려고 할 때 발생
    pool.end(() => {
        console.log('Database pool closed');
        process.exit(0);
    });
});
