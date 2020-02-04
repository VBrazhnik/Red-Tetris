import dotenv from 'dotenv';

dotenv.config();

const config = {
  host: process.env.HOST,
  port: parseInt(process.env.PORT, 10),
  get url() {
    return `http://${this.host}:${this.port}`;
  },
  board: {
    rows: 20,
    columns: 10,
  },
  piecesGeneratingBatch: 10,
  nextPiecesCount: 3,
};

export { config };
