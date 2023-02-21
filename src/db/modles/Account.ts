import {
  Table,
  Model,
  PrimaryKey,
  Column,
  DataType,
  AutoIncrement,
  HasMany,
  Default,
} from "sequelize-typescript";
import Record from "./Record";
import App from "./Apps";
@Table({
  tableName: "account",
  paranoid: true,
})
export default class Account extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, comment: "id" })
  accountId!: number;

  @Column({ type: DataType.STRING, allowNull: true, comment: "昵称" })
  nickName!: string;

  @Column({ type: DataType.STRING, comment: "密码" })
  password!: string;

  @Column({ type: DataType.STRING, comment: "邮箱" })
  email!: string;

  @Column({ type: DataType.INTEGER, comment: "手机号" })
  phone!: number;

  @Column({ type: DataType.STRING, comment: "头像" })
  avatar!: string;

  @Default(20)
  @Column({ type: DataType.INTEGER, comment: "状态" })
  status!: number;

  @Column({ type: DataType.STRING, comment: "注册ip" })
  registerIp!: string;

  @Column({ type: DataType.STRING, comment: "注册地点" })
  registerPlace!: string;

  @Column({ type: DataType.STRING, comment: "salt" })
  salt!: string;

  @HasMany(() => Record)
  records!: Record[];

  @HasMany(() => App)
  apps!: App[];
}
