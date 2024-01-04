<script setup lang="ts">
import {Avatar, Factory, IAvatarProps, Options} from "vue3-avataaars";
import {getCurrentInstance, ref} from "vue";
import CDialog from "@/components/base/dialog/CDialog.vue";
import i18n from "@/i18n/i18n.ts";

const {t} = i18n.global;
const dialogVisible = ref(false);
const avatarProps = ref(Factory({isCircle: false}));
let resolveFunc: ((value: IAvatarProps | PromiseLike<IAvatarProps>) => void) | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let rejectFunc: ((reason?: any) => void) | null = null;
const show = (avatar?: Partial<IAvatarProps>): Promise<IAvatarProps> => {
  avatarProps.value = Factory(avatar);
  dialogVisible.value = true;
  return new Promise<IAvatarProps>((resolve, reject) => {
    resolveFunc = resolve;
    rejectFunc = reject;
  });
};
const hide = () => {
  dialogVisible.value = false;
};
defineExpose({
  show,
  hide,
});
const instance = getCurrentInstance();
const commit = () => {
  if (!resolveFunc) return;
  resolveFunc(avatarProps.value);
  instance?.emit("save");
};
const cancel = () => {
  dialogVisible.value = false;
  if (!rejectFunc) return;
  rejectFunc();
  instance?.emit("cancel");
};
</script>

<template>
  <CDialog
      :title="t('avatar.editor.title')"
      v-model:visible="dialogVisible"
      description="未指定的部分将会自动生成"
      desc-align="center"
      @cancel="cancel"
      @ok="commit"
  >
    <div class="w-full mt-4 flex flex-col items-center">
      <Avatar
          class="w-36 h-36 rounded-full overflow-hidden bg-gray-600"
          v-bind="avatarProps"
      />
      <div class="mt-6">
        <ElForm :model="avatarProps" label-width="5rem">
          <ElFormItem :label="t('avatar.editor.hairColor')">
            <ElColorPicker v-model="avatarProps.hairColor" show-alpha/>
          </ElFormItem>
          <ElFormItem :label="t('avatar.editor.skinColor')">
            <ElColorPicker v-model="avatarProps.skinColor" show-alpha/>
          </ElFormItem>
          <ElFormItem :label="t('avatar.editor.clothesColor')">
            <ElColorPicker v-model="avatarProps.clothesColor" show-alpha/>
          </ElFormItem>
          <ElFormItem :label="t('avatar.editor.topColor')">
            <ElColorPicker v-model="avatarProps.topColor" show-alpha/>
          </ElFormItem>
          <ElFormItem :label="t('avatar.editor.facialHairColor')">
            <ElColorPicker v-model="avatarProps.facialHairColor" show-alpha/>
          </ElFormItem>
          <ElFormItem :label="t('avatar.editor.Accessories')">
            <ElSelect v-model="avatarProps.accessories" placeholder="Chose Accessories">
              <ElOption
                  v-for="item in Options.Accessories"
                  :key="item"
                  :label="item"
                  :value="item"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem :label="t('avatar.editor.Eyes')">
            <ElSelect v-model="avatarProps.eyes" placeholder="Chose Eyes">
              <ElOption
                  v-for="item in Options.Eyes"
                  :key="item"
                  :label="item"
                  :value="item"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem :label="t('avatar.editor.Eyebrows')">
            <ElSelect v-model="avatarProps.eyebrows" placeholder="Chose Eyebrows">
              <ElOption
                  v-for="item in Options.Eyebrows"
                  :key="item"
                  :label="item"
                  :value="item"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem :label="t('avatar.editor.FacialHair')">
            <ElSelect v-model="avatarProps.facialHair" placeholder="Chose FacialHair">
              <ElOption
                  v-for="item in Options.FacialHair"
                  :key="item"
                  :label="item"
                  :value="item"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem :label="t('avatar.editor.Mouths')">
            <ElSelect v-model="avatarProps.mouth" placeholder="Chose Mouths">
              <ElOption
                  v-for="item in Options.Mouths"
                  :key="item"
                  :label="item"
                  :value="item"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem :label="t('avatar.editor.Tops')">
            <ElSelect v-model="avatarProps.top" placeholder="Chose Tops">
              <ElOption
                  v-for="item in Options.Tops"
                  :key="item"
                  :label="item"
                  :value="item"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem :label="t('avatar.editor.Clothes')">
            <ElSelect v-model="avatarProps.clothes" placeholder="Chose Clothes">
              <ElOption
                  v-for="item in Options.Clothes"
                  :key="item"
                  :label="item"
                  :value="item"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem :label="t('avatar.editor.GraphicShirt')">
            <ElSelect v-model="avatarProps.graphicShirt" placeholder="Chose GraphicShirt">
              <ElOption
                  v-for="item in Options.GraphicShirt"
                  :key="item"
                  :label="item"
                  :value="item"
              />
            </ElSelect>
          </ElFormItem>
        </ElForm>
      </div>
    </div>
  </CDialog>
</template>