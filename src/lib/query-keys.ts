export const todoKeys = {
  all: ['todos'] as const,
  infinite: () => [...todoKeys.all, 'infinite'] as const,
  detail: (id: number) => [...todoKeys.all, 'detail', id] as const,
}
