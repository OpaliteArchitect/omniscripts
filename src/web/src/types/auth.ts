export interface LoginRequestDto {
  password: string;
}

export interface LoginResponseDto {
  token: string;
  timestamp: string;
}

export interface IssueScript {
  issue: string;
  script: string;
}

export interface CategoryGroup {
  category: string;
  items: IssueScript[];
}

export interface ScriptsDto {
  categories: CategoryGroup[];
}
