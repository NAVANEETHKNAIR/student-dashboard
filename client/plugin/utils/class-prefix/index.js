export const CLASS_PREFIX = 'sd';

function withClassPrefix(classNames = '') {
  return classNames.split(' ').map(className => `${CLASS_PREFIX}-${className}`).join(' ');
}

export default withClassPrefix;
