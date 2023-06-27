import React from 'react'
import renderer from 'react-test-renderer'
import WarehouseInventories from './WarehouseInventories'

describe('<WarehouseInventories />', () => {
  const defaultProps = {storageType: 'HUESOS TQ SUKA'}
  const wrapper = renderer.create(
    <WarehouseInventories {...defaultProps} />
  )

  test('render', () => {
    expect(wrapper).toMatchSnapshot()
  })
})


