export const decodeToken = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window.atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Token decoding failed:", e);
        return null;
    }
};

export const getRolesFromToken = (token: string): string[] => {
    const decoded = decodeToken(token);
    if (!decoded) return [];
    
    // Common JWT role claims including Microsoft/IdentityServer schemas
    const roles = decoded.roles || 
                  decoded.role || 
                  decoded.scope || 
                  decoded.Roles || 
                  decoded.Role || 
                  decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
                  decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'] ||
                  [];
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    return rolesArray.map(role => String(role));
};

export const getIsAdminFromToken = (token: string): boolean => {
    const decoded = decodeToken(token);
    if (!decoded) return false;
    
    // Check if isAdmin claim exists (case-insensitive check for common variations)
    if (decoded.isAdmin
        || decoded.IsAdmin === true
        || decoded.isadmin === true
        || decoded.isAdmin === 'true'
        || decoded.IsAdmin === 'true' ||
        decoded.isadmin === 'true'
    ) return true;
    
    const roles = getRolesFromToken(token);
    return roles.some(role => role === 'ADMIN');
};
