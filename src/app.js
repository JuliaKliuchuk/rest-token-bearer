const express = require('express');
const cors = require('cors');
const {AuthRouter} = require('./routers/AuthRouter');
const {ExternalRouter} = require('./routers/ExternalRouter');
const {ConfigService} = require('./services/ConfigService');


const app = express();
app.use(cors());

app.use(AuthRouter);
app.use(ExternalRouter);

app.listen(ConfigService.App.APP_PORT);
