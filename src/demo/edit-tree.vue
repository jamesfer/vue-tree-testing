<template>
  <div class="columns">
    <div class="column is-4">
      <h2 class="title">Nodes</h2>
      <div class="edit-node" v-for="node in nodes">
        <span class="tag">{{ node.name }}</span>
      </div>

      <hr>

      <div class="field has-addons">
        <div class="control is-expanded">
          <input type="text" class="input" name="node-name" v-model="newNode.name">
        </div>
        <div class="control">
          <button class="button" @click="addNode()">Add node</button>
        </div>
      </div>

    </div>

    <div class="column">
      <h2 class="title">Links</h2>
      <div class="edit-link" v-for="link in links">
        <span class="link-kind">
          Kind <span class="tag">{{ link.kind }}</span>
        </span>
        <span class="link-from">
          From <span class="tag">{{ link.from }}</span>
        </span>
        <span class="link-to">
          To <span class="tag">{{ link.to }}</span>
        </span>
      </div>

      <hr>

      <div class="columns wrap">
        <div class="column field has-addons">
          <div class="control">
            <label for="link-type" class="button is-static">Link kind</label>
          </div>
          <div class="control">
            <div class="select">
              <select name="link-type" id="link-type" v-model="newLink.kind">
                <option value="">Select kind...</option>
                <option value="parent">Parent</option>
                <option value="partner">Partner</option>
              </select>
            </div>
          </div>
        </div>

        <div class="column field has-addons">
          <div class="control">
            <label for="link-from" class="button is-static">From</label>
          </div>
          <div class="control">
            <div class="select">
              <select name="link-from" id="link-from" v-model="newLink.from">
                <option value="">Select node...</option>
                <option v-for="node in nodes" :value="node.name">{{ node.name }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="column field has-addons">
          <div class="control">
            <label for="link-to" class="button is-static">To</label>
          </div>
          <div class="control">
            <div class="select">
              <select name="link-to" id="link-to" v-model="newLink.to">
                <option value="">Select node...</option>
                <option v-for="node in nodes" :value="node.name">{{ node.name }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="column">
          <button class="button" @click="addLink()">Add link</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: [ 'nodes', 'links' ],
    data() {
      return {
        newLink: {},
        newNode: {},
      };
    },
    methods: {
      addLink() {
        this.links.push(this.newLink);
        this.newLink = {};
      },

      addNode() {
        this.nodes.push(this.newNode);
        this.newNode = {};
      }
    }
  }
</script>

<style>
  .edit-node, .edit-link {
    margin-bottom: 10px;
  }

  .link-kind {
    display: inline-block;
    width: 130px;
  }

  .link-from, .link-to {
    display: inline-block;
    width: 170px;
  }

  .columns.wrap {
    flex-wrap: wrap;
  }
</style>
