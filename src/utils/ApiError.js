class ApiError extends Error{
  constructor(
    statusCode ,
    message = "something went wrong",
    stack = "",
    errors = [],
    ){
      super(message);
      this.statusCode = statusCode;
      this.errors = errors;
      this.message = message;
      this.success = false;
      this.data = null ;
      
      if(stack){
        this.stack = stack;
      }else{
        this.captureStackTrace(this,this.constructor);
      }
    }
}

export {ApiError};