const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'SubChannel',
  tableName: 'sub_channels',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    name: {
      type: 'varchar',
    },
    channelId: {
      name: 'channel_id',
      type: 'int',
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp',
      createDate: true,
    },
    updatedAt: {
      name: 'updated_at',
      type: 'timestamp',
      updateDate: true,
    },
  },
});
