import { GlobalVarComponent } from "../component/GlobalVarComponent";
import { SysCfgComponent } from "../component/SysCfgComponent";

export enum EComName {
  GlobalVarComponent = "GlobalVarComponent",
  SysCfgComponent = "SysCfgComponent",
}

export const EComNameType = {
  [EComName.GlobalVarComponent]: GlobalVarComponent,
  [EComName.SysCfgComponent]: SysCfgComponent,
};
