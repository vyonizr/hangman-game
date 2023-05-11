import { GAME_STATE } from './constants'

export type TGameState = typeof GAME_STATE[keyof typeof GAME_STATE]