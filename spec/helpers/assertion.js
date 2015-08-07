var assertion = {
  expect_cusrsor_position_to_be: function(input, position) {
    expect(input.selectionStart).toBe(position);
    expect(input.selectionEnd).toBe(position);
  },
}
