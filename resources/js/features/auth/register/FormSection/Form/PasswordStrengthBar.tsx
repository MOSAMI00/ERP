
export function PasswordStrengthBar({ password }) {
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(password);

  const getStrengthColor = (strength: number) => {
    if (strength <= 1) return '#E74C3C';
    if (strength === 2) return '#F39C12';
    if (strength === 3) return '#F1C40F';
    return '#2D5A27';
  };

  const getStrengthLabel = (strength: number) => {
    if (strength <= 1) return 'ضعيفة';
    if (strength === 2) return 'متوسطة';
    if (strength === 3) return 'جيدة';
    return 'قوية';
  };

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="h-1 flex-1 rounded-full transition-all"
            style={{
              backgroundColor:
                level <= passwordStrength
                  ? getStrengthColor(passwordStrength)
                  : '#E0E0E0',
            }}
          />
        ))}
      </div>
      <p className="text-xs" style={{ color: getStrengthColor(passwordStrength) }}>
        قوة كلمة المرور: {getStrengthLabel(passwordStrength)}
      </p>
    </div>
  );
}
