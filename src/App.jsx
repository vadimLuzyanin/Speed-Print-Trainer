import React, { Fragment, useState, useEffect } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container'
import { makeStyles, useTheme, useMediaQuery } from '@material-ui/core';
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { useRef } from 'react';

const useStyles = makeStyles({
  charSuccess: {
    color: 'green',
    borderBottom: '3px solid green'
  },
  charError: {
    color: 'red',
    borderBottom: '3px solid red'
  },
  box: {
    fontSize: '25px',
    marginBottom: '25px'
  },
  caret: {
    backgroundColor: 'yellow'
  },
  textForTrainContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '25px'
  },
  textForTrainInput: {
    width: '50vw',
    marginBottom: '25px'
  },
  textForTrainButton: {
    width: '25vw'
  },
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '25px',
    margin: '25px'
  },
  actionButtonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
})

const App = () => {
  const classes = useStyles();

  const [textForTrain, setTextForTrain] = useState('Lorem ipsum dolor sit amet')

  const [pointer, setPointer] = useState(-1)
  const [resultText, setResultText] = useState(textForTrain.split('').map((letter, index) => <span key={index} className={classes.char}>{letter}</span>))

  const [inputNewTextForTrain, setInputNewTextForTrain] = useState('')

  useEffect(() => {
    setResultText(textForTrain.split('').map((letter, index) => <span key={index} className={classes.char}>{letter}</span>))
  }, [textForTrain, classes.char])

  const [startDate, setStartDate] = useState()
  const [finishDate, setFinishDate] = useState()

  const [typoNumber, setTypoNumber] = useState(0)
  const [overallTypoNumber, setOverallTypoNumber] = useState(0)

  const [isMobile, setIsMobile] = useState(false)

  const theme = useTheme()
  const mathches = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    setIsMobile(mathches)
  }, [mathches])

  const typingStart = () => {
    setStartDate(Date.now())
  }

  const typingFinish = () => {
    setFinishDate(Date.now())
  }

  const clearStates = () => {
    setPointer(-1)
    setResultText(textForTrain.split('').map((letter, index) => <span key={index} className={classes.char}>{letter}</span>))
    setStartDate()
    setFinishDate()
    setTypoNumber(0)
    setOverallTypoNumber(0)
  }

  useEffect(() => {
    if (pointer === 0) {
      typingStart()
    }
    if (pointer === textForTrain.length - 1) {
      typingFinish()
    }
  }, [pointer, typoNumber, textForTrain.length])

  const handleKeyDown = (e) => {
    const key = e.key;
    if (key.length === 1) {
      handleLetterPress(key, pointer)
    }
    else if (key === 'Backspace') {
      handleBackspacePress(pointer)
    }
    return
  }

  const handleLetterPress = (key, pointer) => {
    if (key !== textForTrain[pointer + 1] && !finishDate) {
      setTypoNumber((prev) => prev + 1)
      setOverallTypoNumber((prev) => prev + 1)
    }
    setResultText((prev) => {
      let newText = [...prev]
      newText[pointer + 2] = (
        <span
          key={`_${key}${pointer + 2}_`}
          className={classes.caret}>
          {textForTrain[pointer + 2]}
        </span>
      )
      newText[pointer + 1] = (
        <span
          key={`_${key}${pointer + 1}_`}
          className={(key === textForTrain[pointer + 1]) ? classes.charSuccess : classes.charError}>
          {textForTrain[pointer + 1]}
        </span>
      )
      return newText
    })
    setPointer((prev) => prev < textForTrain.length ? prev + 1 : prev)
  }

  const handleBackspacePress = (pointer) => {
    if (resultText[pointer] !== undefined && resultText[pointer].props.className.slice(0, 20) === 'makeStyles-charError') {
      setTypoNumber((prev) => prev - 1)
    }
    setResultText((prev) => {
      let newText = [...prev]
      newText[pointer + 1] = <span key={`_deleted${pointer + 1}_`}>{textForTrain[pointer + 1]}</span>
      newText[pointer] = <span key={`_deleted${pointer}_`} className={classes.caret}>{textForTrain[pointer]}</span>
      return newText
    })
    setPointer((prev) => prev > -1 ? prev - 1 : prev)
  }

  const handleTextForTrainInputChange = (e) => {
    setInputNewTextForTrain(e.target.value)
  }

  const updateTextForTrain = () => {
    clearStates()
    setTextForTrain(inputNewTextForTrain.trim())
  }

  const ref = useRef()

  const focusOnMainContainer = () => {
    ref.current.focus()
  }

  const handleMainContainerBlur = () => {
    startDate && ref.current.focus()
  }

  const disableTextForTrainChange = !(inputNewTextForTrain.trim().length >= 10) || (startDate && !finishDate)
  const totalTime = (finishDate - startDate) / 1000
  const typingSpeed = Math.round((textForTrain.length / ((finishDate - startDate) / 1000 / 60)))
  const accuracy = textForTrain.length > overallTypoNumber ? Math.round((textForTrain.length - overallTypoNumber) / textForTrain.length * 100) : 0

  return (
    <Fragment>
      <CssBaseline />
      <Container
        maxWidth='xl'
        style={{ overflow: 'hidden' }}>
        {isMobile ?
          <Typography variant='h2'>Please use this app from a PC so it can run properly</Typography> :
          <Fragment>
            <Box className={classes.textForTrainContainer}>
              <TextField
                className={classes.textForTrainInput}
                variant='outlined'
                value={inputNewTextForTrain}
                onChange={handleTextForTrainInputChange}
                placeholder='Enter text for train here (10 symbols or more) or use the example'>
              </TextField>
              <Button
                className={classes.textForTrainButton}
                variant='contained'
                color='secondary'
                disabled={disableTextForTrainChange}
                onClick={updateTextForTrain}
              >
                Set new text for train
              </Button>
            </Box>
            <Box
              className={classes.mainContainer}
              onKeyDown={handleKeyDown}
              tabIndex='0'
              ref={ref}
              onBlur={handleMainContainerBlur}>
              {finishDate && startDate && (
                <Fragment>
                  <Typography>Your time: {totalTime} seconds</Typography>
                  <Typography>Your typing speed: {typingSpeed} symbols per minute</Typography>
                  <Typography>Overall typos number: {overallTypoNumber}</Typography>
                  <Typography>Unfixed typos number: {typoNumber}</Typography>
                  <Typography>Your accuracy: {accuracy} %</Typography>
                </Fragment>
              )}
              <Box className={classes.box}>{resultText}</Box>
            </Box>
            <Box className={classes.actionButtonsContainer}>
              {!startDate ?
                <Button
                  variant='contained'
                  color='primary'
                  onClick={focusOnMainContainer}
                >
                  Start typing!
                </Button> :
                <Button
                  variant='contained'
                  color='primary'
                  onClick={clearStates}
                >
                  Try again?
                 </Button>
              }
            </Box>
          </Fragment>
        }
      </Container>
    </Fragment >
  )
}

export default App