const STATE_PREPUSH = Symbol();
const STATE_PREMAIL = Symbol();
const STATE_END = Symbol();

const BLUEPRINT_NAME = "forgotten-cart";

const triggers = {
  "cart/edit": async payload => {
    const existingMachine = await db.get(
      `
      SELECT * from machines m
      WHERE NOT m.finished
        AND m.blueprint = $
        AND json_extract(m.data, '$.user_id') = $
    `,
      [BLUEPRINT_NAME, payload.user_id]
    );

    if (existingMachine) {
      await db.get(
        `
        UPDATE machines
        SET cursor = $, waits_for = $
        WHERE id = $ AND NOT m.finished
      `,
        [STATE_PREPUSH, new Date(), existingMachine.id]
      );
    } else {
      await db.get(
        `
        INSERT INTO machines (blueprint, cursor, data)
        VALUES ($, $, $)
      `,
        [BLUEPRINT_NAME, STATE_PREPUSH, payload.data]
      );
    }
  },

  "cart/finish": async payload => {
    const existingMachine = await db.get(
      `
      SELECT * from machines m
      WHERE NOT m.finished
        AND m.blueprint = $
        AND json_extract(m.data, '$.user_id') = $
    `,
      [BLUEPRINT_NAME, payload.user_id]
    );

    if (existingMachine) {
      await db.get(
        `
        UPDATE machines
        SET cursor = $, finished = t
        WHERE id = $
      `,
        [STATE_END, new Date(), existingMachine.id]
      );
    }
  }
};

const transitions = [
  {
    from: STATE_PREPUSH,
    to: STATE_PREMAIL,
    name: "send push",
    f: machine => {
      if (machine.data.token) {
        fcmPush(machine.data.token, "some text to push");
      }
    }
  },
  {
    from: STATE_PREPUSH,
    to: STATE_END,
    name: "cart was finished",
  },
  {
    from: STATE_PREMAIL,
    to: STATE_END,
    name: "cart was finished",
  },
  {
    from: STATE_PREMAIL,
    to: STATE_END,
    name: "send email",
    f: machine => {
      if (machine.data.email) {
        fcmPush(machine.data.email, "some text to push");
      }
    }
  },
];

module.exports = {};
