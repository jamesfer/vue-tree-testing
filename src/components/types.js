import { max, map } from 'lodash';

export class UniqueId {
  constructor(prefix = '') {
    this.id = prefix + Math.random().toString(36).substring(2, 10);
  }
}


export class TreeGroup extends UniqueId {
  /**
   * @param {Tree} root
   * @param {TreeLink[]} rightLinks
   * @param {TreeLink[]} leftLinks
   */
  constructor(root, rightLinks = [], leftLinks = []) {
    super('tree-group-');
    this.root = root;
    this.rightLinks = rightLinks;
    this.leftLinks = leftLinks
  }

  getHeight() {
    return max([
      this.root.getHeight(),
      ...map(this.rightLinks, link => link.getHeight + link.verticalOffset),
      ...map(this.leftLinks, link => link.getHeight + link.verticalOffset),
    ]);
  }
}


export class TreeLink extends UniqueId {
  /**
   * @param {TreeGroup} to
   * @param {number} verticalOffset
   */
  constructor(to, verticalOffset) {
    super('tree-link-');
    this.to = to;
    this.verticalOffset = verticalOffset;
  }

  getHeight() {
    return this.to.getHeight();
  }
}


export class Tree extends UniqueId {
  /**
   * @param {string} name
   * @param {Tree[]} children
   * @param {Tree} partner
   */
  constructor(name, children = [], partner = null) {
    super('tree-');
    this.name = name;
    this.children = children;
    this.partner = partner;
  }

  getHeight() {
    let max2 = max([
      2 + max(map(this.children, child => child.getHeight())),
      this.partner ? this.partner.getHeight() : 0,
    ]);
    console.log('height of', this.name, max2);
    return max2;
  }
}
