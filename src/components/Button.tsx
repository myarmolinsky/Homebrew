import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

export const Button = ({ style, ...restProps }: TouchableOpacityProps) => {
  return (
    <TouchableOpacity
      style={[
        style,
        {
          backgroundColor: 'teal',
          padding: 20,
          borderRadius: 6,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        },
      ]}
      {...restProps}
    />
  );
};
