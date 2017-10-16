module.exports = {
  scripts: {
    root: "echo 'this is a root client script'",
    nested: {
      child1: "echo 'this is a nested child1'",
      child2: {
        script: "echo 'this is a nested child2'",
        description: 'this is a description',
      },
      child3: {
        deep: {
          script: "echo 'this is a deep-nested child3'",
          description: 'this is a description',
        },
      },
    },
  },
}
