class APIError extends Error { 
    constructor(name, statusCode, errorCode, message = null) {
        super(message || name);   
        this.name = name;   
        this.status = statusCode;   
        this.errorCode = errorCode; 
    } 
}


class BadRequest extends APIError { 
    constructor() {  
         super('BadRequest', 400, 'BAD_REQUEST'); 
    } 
}

class ResourceNotFound extends APIError{
    constructor() {  
        super('ResourceNotFound', 404, 'RESOURCE_NOT_FOUND'); 
   } 
}

class RelatedResourceNotFound extends APIError{
    constructor() {  
        super('RelatedResourceNotFound', 404, 'RELATED_RESOURCE_NOT_FOUND'); 
   } 
}

class ResourceAlreadyExist extends APIError { 
    constructor() {  
         super('ResourceAlreadyExist', 409, 'RESOURCE_ALREADY_EXISTS'); 
    } 
}

class InvalidURLError extends APIError { 
    constructor() {  
         super('InvalidURLError', 404, 'RESOURCE_NOT_FOUND'); 
    } 
}

class InternalServerError extends APIError { 
    constructor() {  
         super('InternalServerError', 500, 'INTERNAL_SERVER_ERROR'); 
    } 
}


module.exports = {
    APIError: APIError,
    BadRequest: BadRequest,
    ResourceAlreadyExist: ResourceAlreadyExist,
    InvalidURLError:InvalidURLError,
    ResourceNotFound:ResourceNotFound,
    RelatedResourceNotFound:RelatedResourceNotFound,
    InternalServerError: InternalServerError
  }