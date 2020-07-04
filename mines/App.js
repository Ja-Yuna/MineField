import React, {Component} from 'react';
import parameters from './src/parameters'
import { View, StyleSheet, Text, Alert} from 'react-native';
import Minefield from './src/components/Minefield'
import Header from './src/components/Header'
import LevelSelection from './src/screens/LevelSelection'
import { 
          createMineBoard,
          cloneBoard,
          openField,
          hadExplosion,
          wonGame,
          showMines,
          invertFlag,
          flagUsed
        
        } from './src/functions'

export default class App extends Component{
  constructor(props){
    super(props)
    this.state = this.createState()
  }
  minesAmount = () => {
    const cols = parameters.getColumnsAmount()
    const rows = parameters.getRowsAmount()
    return Math.ceil(cols * rows * parameters.difficultLevel)
  }
  createState = () => {
    const cols = parameters.getColumnsAmount()
    const rows = parameters.getRowsAmount()
    return{
      board: createMineBoard(rows, cols, this.minesAmount()),
      won: false,
      lost: false,
      showLevelSelection: false,
    }
  }
    onOpenField =( row, column) => {
      const board = cloneBoard(this.state.board)
      openField(board, row, column)
      const lost = hadExplosion(board)
      const won = wonGame(board)

      if (lost) {

        showMines(board)
        Alert.alert('You Lost')
      }
      if (won){
        Alert.alert('You Win')
      }
        this.setState({ board, lost, won})
    }
      onSelectField = (row, column) => {
        const board = cloneBoard(this.state.board)
        invertFlag(board, row, column)
        const won = wonGame(board)

        if(won){
          Alert.alert('Congratulations!', 'you won')
        }
        this.setState({ board, won})
      }
      onLevelSelected = level => {
        parameters.difficultLevel = level
        this.setState(this.createState())

      }

  render(){
    return(
      <View style={styles.container}>
        <LevelSelection isVisible={this.state.showLevelSelection}
        onLevelSelected={this.onLevelSelected}
        onCancel={() => this.setState({showLevelSelection: false})}/>
        <Header flagLeft={this.minesAmount() - flagUsed(this.state.board)}
        onNewGame={() => this.setState(this.createState())}
        onFlagPress={() => this.setState({showLevelSelection: true})}/>
        <View style={styles.board}>
          <Minefield board = {this.state.board}
          onOpenField={this.onOpenField}
          onSelectField={this.onSelectField}/>
        </View>
        

      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end"
  },
  board: {
    alignItems: 'center',
    backgroundColor: '#AAA'
  }
});