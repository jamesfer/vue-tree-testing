import { max, map, each } from 'lodash';

export class UniqueId {
  constructor(prefix = '') {
    this.id = prefix + Math.random().toString(36).substring(2, 10);
  }
}


export class TreeLinkLayer extends UniqueId {
  constructor(rightLinks = [], leftLinks = []) {
    super('tree-link-layer-');

    this.group = null;
    this.rightLinks = rightLinks;
    this.leftLinks = leftLinks;
  }
}


export class TreeGroup extends UniqueId {
  /**
   * @param {Tree} root
   * @param {TreeLinkLayer[]} layers
   */
  constructor(root, layers = []) {
    super('tree-group-');

    if (root.parent) {
      // Root tree must not have a parent
      throw Error('The root tree in a group must not have a parent');
    }

    if (root.group) {
      throw Error('The root tree already belongs to a group');
    }
    root.group = this;

    this.root = root;
    this.childLinks = [];
    this.parentLinks = [];
    this.layers = [];
    each(layers, layer => this.addLayer(layer));
  }

  addLink(link) {
    this.childLinks.push(link);
    link.to.parentLinks.push(link);
  }

  createLayer() {
    const newLayer = new TreeLinkLayer();
    this.addLayer(newLayer);
    return newLayer;
  }

  addLayer(layer) {
    this.layers.push(layer);
    layer.group = this;
  }

  hasParent() {
    return this.parentLinks.length > 0;
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
    this.partner = partner;
    this.parent = null;
    this.group = null;
    this.children = [];
    each(children, child => this.addChild(child));
  }

  /**
   * Returns the maximum height of this tree and its partner.
   * @returns {*}
   */
  getHeight() {
    let childHeight = max(map(this.children, child => 1 + child.getHeight()));
    let partnerHeight = this.partner ? this.partner.getHeight() : 0;
    return max([ 1, childHeight, partnerHeight ]);
  }

  /**
   * Returns the distance from this node to its root.
   * @returns {number}
   */
  getDepth() {
    return this.parent ? 1 + this.parent.getDepth() : 0;
  }

  addChild(child) {
    this.children.push(child);
    child.parent = this;
  }

  hasAncestor(otherTree) {
    return this.parent === otherTree
      || this.parent && this.parent.hasAncestor(otherTree);
  }

  getRoot() {
    return this.parent ? this.parent.getRoot() : this;
  }

  getGroup() {
    return this.getRoot().group;
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
