import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button, buttonVariants } from "../ui/button";
import { DatabaseIcon, Loader, Search, Upload } from "lucide-react";
import { cn } from "@/utils/cn";
import {
  supportedFileExtensions,
  supportedFileTypes,
  vm,
} from "@/stores/store";
import { Checkbox } from "../ui/checkbox";
import { formatDate } from "@/utils/format/date";
import { ScrollArea } from "../ui/scroll-area";
import { pluralize } from "@/utils/locale/pluralize";
import { IconInput } from "../ui/input";
import { useDebouncedEffect } from "@/utils/hooks/use-debounce";
import { AnimatePresence, motion } from "framer-motion";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export const DatabaseDrawer: FC<{
  isCollapsed: boolean;
}> = observer(({ isCollapsed }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredFiles, setFilteredFiles] = useState(vm.database);
  const [selectedFileTypes, setSelectedFileTypes] = useState<
    {
      label: string;
      value: string[];
    }[]
  >(supportedFileExtensions);

  useDebouncedEffect(
    () =>
      setFilteredFiles(
        vm.database.filter(
          (file) =>
            file.name.toLowerCase().includes(search.trim().toLowerCase()) &&
            selectedFileTypes.some((type) =>
              type.value.includes(file.name.split(".")[1]),
            ),
        ),
      ),
    [vm.database, search, selectedFileTypes],
    250,
  );

  useEffect(() => {
    if (!open) {
      setSearch("");
      setSelectedFileTypes(supportedFileExtensions);
      vm.selectedFiles.forEach((file) => (file.selected = false));
    }
  }, [open]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          className={cn(
            "mb-3 sm:mb-2 min-h-11 sm:min-h-12 md:rounded-full md:mx-2 transition-all",
            isCollapsed && "md:rounded-md",
          )}
        >
          <DatabaseIcon />
          <span className={cn(isCollapsed && "sr-only")}>База данных</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[84vh] overflow-hidden flex flex-col h-full">
        <DrawerHeader>
          <DrawerTitle>
            База данных{" "}
            <span className="text-zinc-300">({filteredFiles.length})</span>
          </DrawerTitle>
          <DrawerDescription>
            Здесь вы можете посмотреть, удалить или добавить новые файлы в базу
            данных
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col sm:flex-row sm:items-center mx-4 mb-3 gap-x-4 gap-y-2">
          <IconInput
            value={search}
            placeholder="Поиск..."
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search />}
          />
          <ToggleGroup
            type="multiple"
            value={selectedFileTypes.map((type) => type.label)}
            onValueChange={(v) =>
              setSelectedFileTypes(() =>
                supportedFileExtensions.filter((type) =>
                  v.includes(type.label),
                ),
              )
            }
          >
            {supportedFileExtensions.map((type, i) => (
              <ToggleGroupItem key={type.value.join(",")} value={type.label}>
                {type.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2 mx-4">
            {filteredFiles.length === 0 && (
              <div className="text-center text-sm text-muted-foreground flex-1 pt-4 h-full flex items-center justify-center col-span-full">
                Нет файлов
              </div>
            )}
            <AnimatePresence>
              {filteredFiles.map((file) => (
                <motion.div
                  key={file.id}
                  layout
                  initial={{ opacity: 0, scale: 1, y: 0, x: 0 }}
                  animate={{
                    opacity: file.isUploading ? 0.5 : 1,
                    scale: 1,
                    y: 0,
                    x: 0,
                  }}
                  exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                  className={cn(
                    "flex items-center space-x-4 p-4 border rounded-lg relative overflow-hidden w-full",
                    file.selected && "border-primary",
                    file.isUploading && "opacity-50",
                  )}
                >
                  {file.isUploading ? (
                    <Loader className="animate-spin duration-spinner" />
                  ) : (
                    <Checkbox
                      checked={file.selected}
                      onCheckedChange={() => (file.selected = !file.selected)}
                      className="before:absolute before:inset-0"
                    />
                  )}
                  <div className="flex-1 w-full overflow-hidden flex flex-col">
                    <div className="font-medium overflow-hidden flex-1 flex">
                      <span className="truncate">
                        {file.name.split(".")[0]}.
                      </span>
                      <span>{file.name.split(".")[1]}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {file.isUploading
                        ? "Загружается..."
                        : `Загружен ${formatDate(file.uploadDate, "ddMMyyyyHHmm")}`}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
        <DrawerFooter className="flex sm:flex-row flex-col gap-2 flex-wrap w-full">
          <DrawerClose asChild>
            <Button variant="ghost" className="hidden sm:block">
              Отмена
            </Button>
          </DrawerClose>
          <Button
            className="sm:ml-auto"
            variant="destructive"
            onClick={() => vm.deleteFiles()}
            disabled={vm.selectedFiles.length === 0}
          >
            Удалить{" "}
            {vm.selectedFiles.length > 0 && (
              <>
                {vm.selectedFiles.length}{" "}
                {pluralize(vm.selectedFiles.length, [
                  "файл",
                  "файла",
                  "файлов",
                ])}
              </>
            )}
          </Button>
          <label
            className={cn(
              buttonVariants({ variant: "default" }),
              "relative cursor-pointer",
            )}
          >
            <input
              type="file"
              multiple
              accept={supportedFileTypes.join(",")}
              className="sr-only"
              onChange={(e) => {
                console.log({ e });
                if (e.target.files) {
                  vm.uploadFiles(Array.from(e.target.files));
                }
              }}
            />
            <Upload />
            <span>Загрузить файлы</span>
          </label>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
});
