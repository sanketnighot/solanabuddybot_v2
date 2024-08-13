interface IPasswordGenerationState {
  password: string[]
  previosMessageId?: number
}

export const passwordGenerationState = new Map<
  number,
  IPasswordGenerationState
>()
