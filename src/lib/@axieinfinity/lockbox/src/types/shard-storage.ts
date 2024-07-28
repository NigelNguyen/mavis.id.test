export interface ShardStorage {
  get: () => string | undefined
  set: (newShard: string) => void
}
