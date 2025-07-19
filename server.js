// server.js
const express = require('express');
const kasatpelRoutes = require('./routes/kasatpel');
const regionalRoutes = require('./routes/regional');
const cors = require('cors');

const app = express();
app.use(cors({origin:'*'}));
app.use(express.json());

app.use('/api/kasatpel', kasatpelRoutes);
app.use('/api/regional', regionalRoutes);

app.get('/ping', (req, res) => res.send('pong'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
