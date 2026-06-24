import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import calculateWinner from './helpers/calculateWinner'
import Board from './components/board/Board'
import GameInfo from './components/game-info/GameInfo'

// ==========================================
// 🚨 STEP 1 & 2: IMPORT & INITIALIZE SENTRY
// ==========================================
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration()
  ],
// ... rest of the code
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
})

class Game extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleClick (i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  jumpTo (step) {
    console.log(step)
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    })
  }

  // Helper function to force an unhandled runtime error
  triggerSabotageCrash () {
    console.log('💣 Sabotage button clicked! Exploding application...')
    console.error('Sabotage prevented: executeNonExistentFunction does not exist.')
  }

  render () {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)
    let status
    if (winner) {
      status = 'Winner: ' + winner
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
    }
    return (
      <>
        {/* ==========================================
            🚨 STEP 3: THE INTENTIONAL SABOTAGE BUTTON
           ========================================== */}
        <div style={{ textAlign: 'center', margin: '20px' }}>
          <button
            onClick={() => this.triggerSabotageCrash()}
            style={{ padding: '10px 20px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            💥 Trigger Live Production Crash
          </button>
        </div>

        <h1>Tic Tac Toe</h1>
        <section className='game'>
          <GameInfo
            status={status}
            winner={winner}
            xIsNext={this.state.xIsNext}
          />
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            jumpTo={(i) => this.jumpTo(i)}
          />
        </section>
      </>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<Router basename={process.env.REACT_APP_URI}>
  <Routes>
    <Route path='/tic-tac-toe' element={<Game />} />
  </Routes>
</Router>)