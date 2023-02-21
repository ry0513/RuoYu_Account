import {
  Table,
  Model,
  PrimaryKey,
  Column,
  DataType,
  AutoIncrement,
  ForeignKey,
} from "sequelize-typescript";
import Account from "./Account";

@Table({
  tableName: "Apps",
  paranoid: true,
})
export default class Apps extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, comment: "AppID" })
  appId!: number;

  @Column({ type: DataType.STRING, allowNull: false, comment: "名称" })
  appName!: string;

  @Column({ type: DataType.STRING, allowNull: false, comment: "client_key" })
  clientKey!: string;

  @Column({ type: DataType.STRING, allowNull: false, comment: "server_key" })
  serveKey!: string;

  @ForeignKey(() => Account)
  @Column({ type: DataType.INTEGER, comment: "账号ID" })
  accountId!: number;
}
