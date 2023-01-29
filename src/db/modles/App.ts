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
  tableName: "App",
  paranoid: true,
})
export default class App extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, comment: "AppID" })
  appId!: number;

  @Column({ type: DataType.STRING, allowNull: false, comment: "名称" })
  appName!: string;

  @Column({ type: DataType.STRING, allowNull: false, comment: "AppKey" })
  appKey!: string;

  @ForeignKey(() => Account)
  @Column({ type: DataType.INTEGER, comment: "账号ID" })
  accountId!: number;
}
