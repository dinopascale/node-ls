import app from '../app'

export const generateBreadcrumb = (pathToStrip: string, fullPath: string): string => {
    return fullPath.replace(pathToStrip + '/', '');
}

export const generateBackLink = (path: string): string => {
    return path.split('/').slice(0, -1).join('/').replace(app.get('homePath'), '') || '/'
}