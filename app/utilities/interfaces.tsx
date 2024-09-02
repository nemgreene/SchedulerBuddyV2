import moment from "moment";

// allocations required
type ratioArray = [number, number];

export const matrixSymbols = {
  "I+": "Must Have",
  "P+": "Prefers To Have",
  "I-": "Must Not Have",
  "P-": "Pfreferst Not Have",
};

export interface MatrixKeys {
  "I+": string;
  "P+": string;
  "I-": string;
  "P-": string;
}
export interface MartrixChildInterface {
  name: string;
  id: string;
}

export type KeyInterface = "assets" | "allocations" | "locations" | string;
export type DayCardVariant = "compact" | "default";
export type ModalKeyInterface = "AddEntry" | "EditEntry" | "AddBlock";

export interface MatrixInterface {
  "I+": MartrixChildInterface[];
  "P+": MartrixChildInterface[];
  "I-": MartrixChildInterface[];
  "P-": MartrixChildInterface[];
}

export interface AllocationBlockInterface {
  matrix: MatrixInterface;
  ratio?: Array<number>;
  capacity?: number;
  headCount?: number;
  timeStart: moment.Moment | string;
  timeEnd: moment.Moment | string;
  name?: string;
  id?: string;
}

export interface AllocationInterface {
  name: string;
  id: string;
  matrix: MatrixInterface;
  ratio?: Array<number>;
  capacity?: number;
  headCount?: number;
  blocks: Array<AllocationBlockInterface>;
}

export interface DayInterface {
  allocations: Array<AllocationInterface>;
  assets: Array<AllocationInterface>;
  locations: Array<AllocationInterface>;
}

export type NiceNames = {
  name: string;
  id: string;
};

export interface TimelineData {
  [key: string]: {
    allocations: AllocationBlockInterface[];
    assets: AllocationBlockInterface[];
    locations: AllocationBlockInterface[];
  };
}

export interface Phenome {
  [key: string]: PhenomeBlock[];
}
export interface PhenomeBlock {
  allocations: AllocationBlockInterface;
  assets: AllocationBlockInterface;
  locations: AllocationBlockInterface;
}
// ------------------------------------------Output---------------------------------

export interface OutputBlock {
  allocations: AllocationBlockInterface[];
  assets: AllocationBlockInterface[];
  locations: AllocationBlockInterface[];
}
export interface OutputInterface {
  [key: string]: OutputBlock;
}
