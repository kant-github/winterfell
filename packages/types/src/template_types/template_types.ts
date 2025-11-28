export interface ContractTemplate {
  id: string;
  title: string;
  image: string;
  description: string;
  contractType?: string; // use enum later
  clientSdk?: { functions: string[] };
}
