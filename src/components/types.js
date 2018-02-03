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
   * @param {Node} node
   * @param {Tree[]} children
   * @param {Tree} partner
   */
  constructor(node, children = [], partner = null) {
    super('tree-');
    this.node = node;
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


export class Node {
  /**
   * @param {string} id
   * @param {string} name
   */
  constructor(id, name = '') {
    this.id = id;
    this.name = name;

    if (!this.name) {
      this.name = this.id;
    }
  }
}
