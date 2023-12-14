from rest_framework import serializers
from users.models import User


def validate_username(value):
    if User.objects.filter(username=value).exists():
        raise serializers.ValidationError('username already exists.')
    return value


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = '__all__'

        # fields = ["username","email", "name", "password", "confirm_password"]
        # write_only_fields = ('password',)
        # read_only_fields = ('is_staff', 'is_superuser', 'is_active', 'date_joined',)

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')

        if password != confirm_password:
            raise serializers.ValidationError("Password and Confirm_Password doesn't match.")
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            name=validated_data['name'],
            email=validated_data['email'],
            password=validated_data['password'],
            profile_image=validated_data['profile_image'],
            role=validated_data['role']

        )
        user.is_active = True
        user.save()
        return user

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.email = validated_data.get('email', instance.email)
        instance.username = validated_data.get('username', instance.username)
        instance.profile_image = validated_data.get('profile_image', instance.profile_image)
        instance.role = validated_data.get('role', instance.role)
        instance.save()
        return instance