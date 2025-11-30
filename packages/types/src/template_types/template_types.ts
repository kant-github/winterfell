export interface ContractData {
  id: string;
  title: string;
  description: string;
  summary: string;
  contractType?: string; // use enum later
  clientSdk?: { functions: string[] };
  deployed: boolean;
  createdAt: Date;
}

export interface ContractTemplateData extends ContractData {
  image: string;
}
