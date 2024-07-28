import { ShardStorage } from "./types/shard-storage"

export class InMemShardStorage implements ShardStorage {
  private clientShard?: string

  get = () => {
    return this.clientShard
  }

  set = (newShard: string) => {
    this.clientShard = newShard
  }
}
