export interface LogosData {
    logos: LogoEntry[];
    numberOfPixelsUsed: number;
  };
  
  export interface LogoEntry {
    pixels: LogoPixel[];
    logoLink: string;
    title : string;
    _id: string;
    success?: boolean;
    email: string;
    username: string;
    description: string;
    rows: string;
    cols: string;
    response?: {
      data: {
        message: string;
        errCode: number;
      } | undefined;
    } | undefined;
  };
  
  interface LogoPixel {
    pixelNumber: number;
    smallImage: string;
    logoLink: string;
    title: string;
  };
  
export interface SelectedCell {
    cellId: number;
    canvasData: string;
  };

export interface LoginForm {
    email: string;
    password: string;
  };
export interface UserData {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  token: string;
  isVerified: boolean;
};

export interface LoginPayload {
  errCode?: number; 
  userToken?: string;
  message?: string;
}

export interface AddPixelPayload {
  success: boolean;
  paymentLink: string;
  response: {
    data: {
      message: string;
      errCode: number;
    } | undefined;
  } | undefined;
};
export interface Pixel {
  username: string;
  email: string;
  title: string;
  description: string;
  position: { x: number; y: number };
  url: string;
  image: File | null;
  size: { width: number; height: number };
}

export interface globalDataI {
  loading: boolean;
  toasting: { message: string; type: string };
};
